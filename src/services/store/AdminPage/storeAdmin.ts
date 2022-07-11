import { Glasses } from "../../../interfaces/consts/Glasses";
import { action, makeObservable, observable } from "mobx";
import { createContext } from "react";
import {
  addGlassesToList,
  deleteGlassesFromList,
  editGlassesFromList,
  getGlassesList,
} from "../../../api/firebase/store/glasses";
import { createNewGlassesInfo } from "../../../utils/editGlasses/createNewGlassesInfo";
import { uploadGlassesToStorage } from "../../../api/firebase/storage/glasses";
import { PreviewScene } from "../../../scenes/AdminPage/PreviewScene/PreviewScene";
import { getPngFromFbx } from "../../../utils/editGlasses/getPngFromFbx";
import { deleteObject, getDownloadURL, listAll, ref } from "firebase/storage";
import { firebaseStorage } from "../../../utils/firebase/firebase";
import { Group } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { glasses_list } from "../../../consts/glasses";
import { IStoreForTF } from "../../../interfaces/services/store/StoreForTF";
import Scene from "../../../scenes/Scene";
import IFacetype from "../../../interfaces/Facetype";
import { StoreWithActiveGlasses } from "../../../interfaces/services/store/StoreWithActiveGlasses";

interface StoreGlasses {
  active_glasses: undefined | number | string;
  selected: undefined | Glasses;
  list: Glasses[];
  files: Record<string, Group>;
  filesReady: boolean;
  saveAborted: boolean;
  saved: boolean;
  savePngAborted: boolean;
  pngSaved: boolean;
}

class StoreAdmin implements IStoreForTF, StoreWithActiveGlasses {
  tf: {
    facedata: any;
    initiated: boolean;
  } = {
    facedata: undefined,
    initiated: false,
  };

  facetype: IFacetype = {
    type: NaN,
    current_detections: 0,
    detections: 1,
  };

  glasses: StoreGlasses = {
    active_glasses: undefined,
    selected: undefined,
    list: [],
    files: {},
    filesReady: false,
    saveAborted: false,
    saved: false,
    savePngAborted: false,
    pngSaved: false,
  };

  acceptedFiles: File[] = [];
  acceptedFilesErrors: string[] = [];
  scene: null | Scene = null;
  previewScene: null | PreviewScene = null;

  constructor() {
    makeObservable(this, {
      facetype: observable,
      updateFacetype: action,

      glasses: observable,
      loadGlassesList: action,
      clearIndicators: action,
      setSelected: action,
      saveAllChangesInTheSelectedToFirebase: action,
      loadAllGlassesFiles: action,

      acceptedFiles: observable,
      getFilesFromUser: action,
      acceptedFilesErrors: observable,

      scene: observable,

      previewScene: observable,
      makePreviewPngAndUpload: action,

      processUserFilesAndUploadToFirebase: action,
      deleteGlassesFromFirebase: action,
    });
  }

  updateFacetype(facetype: IFacetype) {
    this.facetype.type = facetype.type;
    this.facetype.current_detections = facetype.current_detections;
    this.facetype.detections = facetype.detections;
  }

  async loadGlassesList() {
    const querySnapshot = await getGlassesList();

    this.glasses.list = [];
    glasses_list.forEach((item) => {
      this.glasses.list.push(JSON.parse(JSON.stringify(item)));
    });

    querySnapshot.forEach((doc) => {
      this.glasses.list.push({
        id: doc.id,
        ...doc.data(),
      } as Glasses);
    });

    this.glasses.list.sort((item1, item2) => {
      if (item1.local || item2.local) {
        return 0;
      }

      return item1.name.localeCompare(item2.name);
    });

    if (this.scene) {
      this.scene.glasses_controller.loadGlassesList(this.glasses.list);
    }

    this.clearIndicators();
  }

  clearIndicators() {
    this.glasses.saved = false;
    this.glasses.saveAborted = false;
    this.glasses.pngSaved = false;
    this.glasses.savePngAborted = false;
  }

  setSelected(id: number | string) {
    this.glasses.selected = this.glasses.list.find((item) => id === item.id);
    this.glasses.active_glasses = this.glasses.selected?.id;
  }

  async saveAllChangesInTheSelectedToFirebase() {
    this.clearIndicators();

    if (!this.glasses.selected || this.glasses.selected.local) {
      this.glasses.saveAborted = true;

      return;
    }

    const { id, ...data } = this.glasses.selected;

    await editGlassesFromList(id, { ...data, loaded: false, model: null });

    this.glasses.saved = true;
  }

  async loadAllGlassesFiles() {
    this.glasses.filesReady = false;

    const fbxLoader = new FBXLoader();

    for (const item of this.glasses.list) {
      switch (item.local) {
        case true:
          this.glasses.files[item.id] = await fbxLoader.loadAsync(
            document.location.origin + "/" + item.file_path
          );
          break;

        default:
          const url = await getDownloadURL(
            ref(firebaseStorage, item.file_path)
          );
          this.glasses.files[item.id] = await fbxLoader.loadAsync(url);
      }
    }

    if (this.scene) {
      this.scene.glasses_controller.loadGlassesFiles(this.glasses.files);
    }

    this.glasses.filesReady = true;
  }

  getFilesFromUser(files: File[]) {
    this.acceptedFiles = files;
  }

  async makePreviewPngAndUpload() {
    this.clearIndicators();

    if (!this.glasses.selected || this.glasses.selected.local) {
      this.glasses.savePngAborted = true;

      return;
    }

    const modelUrl = await getDownloadURL(
      ref(firebaseStorage, this.glasses.selected.file_path)
    );
    const data = (await getPngFromFbx(
      this.glasses.selected,
      modelUrl
    )) as string;
    const res = await fetch(data);
    const blob = await res.blob();
    const file = new File([blob], "File name", { type: "image/png" });
    const previewPath = await uploadGlassesToStorage(
      file,
      `${this.glasses.selected.id}/${this.glasses.selected.id}_preview.png`
    );
    const previewUrl = await getDownloadURL(ref(firebaseStorage, previewPath));

    await editGlassesFromList(this.glasses.selected.id, {
      preview_file_path: previewUrl,
      snapshot_options: this.glasses.selected.snapshot_options,
    });
    await this.loadGlassesList();
    this.setSelected(this.glasses.selected.id);

    this.glasses.pngSaved = true;
  }

  async processUserFilesAndUploadToFirebase() {
    this.acceptedFilesErrors = [];

    if (!this.acceptedFiles.length) return;

    let glassesId: string | undefined;

    const fbxFile = this.acceptedFiles.find((file) =>
      file.name.endsWith(".fbx")
    );
    const additionalFiles = this.acceptedFiles.filter(
      (file) => !file.name.endsWith(".fbx")
    );

    if (!fbxFile) {
      this.acceptedFilesErrors.push("No fbx file founded");
      return;
    }

    const fileInfo = createNewGlassesInfo(fbxFile);
    await addGlassesToList(fileInfo).then((id) => (glassesId = id));

    if (!glassesId) {
      this.acceptedFilesErrors.push("Not received Id from Firebase");
      return;
    }

    const url = await uploadGlassesToStorage(
      fbxFile,
      `${glassesId}/${glassesId}_model.fbx`
    );

    await editGlassesFromList(glassesId, { file_path: url });

    for (const file of additionalFiles) {
      await uploadGlassesToStorage(file, `${glassesId}/${file.name}`);
    }

    await this.loadGlassesList();
  }

  async deleteGlassesFromFirebase(item: Glasses) {
    const directoryPath = item.file_path.slice(
      0,
      item.file_path.lastIndexOf("/")
    );

    const directoryRef = ref(firebaseStorage, directoryPath);

    await listAll(directoryRef).then(async (res) => {
      for (const item1 of res.items) {
        await deleteObject(item1);
      }
    });

    await deleteGlassesFromList(item.id);

    await this.loadGlassesList();
    await this.loadAllGlassesFiles();
  }
}

const storeAdmin = new StoreAdmin();
export const StoreAdminContext = createContext(storeAdmin);
export { StoreAdmin };

export default storeAdmin;
