import Layer from "./Layer.js";

class NN {
  layers = [];

  constructor(layers = []) {
    for (let i = 0; i < layers.length; i++) {
      this.layers[i] = new Layer(layers[i].neurons, layers[i].rate, layers[i].recurrent);
    }

    for (let i = 0; i < layers.length - 1; i++) {
      this.layers[i].Connect(this.layers[i + 1]);
    }
  }

  Activation(inputs) {
    return this.layers[0].Activation(inputs);
  }

  Propagate(outputs) {
    this.layers[this.layers.length - 1].Propagate(outputs);
  }

  Download() {
    let config = {
      layers: [],
    };

    for (let i = 0; i < this.layers.length; i++) {
      config.layers[i] = this.layers[i].Download();
    }

    return JSON.stringify(config);
  }

  Upload(config) {
    this.layers = [];

    for (let i = 0; i < config.layers.length; i++) {
      this.layers[i] = new Layer(config.layers[i].size, config.layers[i].rate, config.layers[i].recurrent);
    }
    for (let i = 0; i < config.layers.length; i++) {
      if (i != config.layers.length - 1)
        this.layers[i].Connect(this.layers[i + 1]);

      this.layers[i].Upload(config.layers[i]);
    }
  }
}

export default NN;
