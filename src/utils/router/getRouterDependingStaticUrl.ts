export const getRouterDependingStaticUrl = (
  itemPath: string,
  isPath: boolean = true
) => {
  switch (isPath) {
    case false:
      switch (!!document.location.hash) {
        case true:
          return (
            document.location.href.slice(
              0,
              document.location.href.indexOf("#")
            ) +
            "#/" +
            itemPath
          );

        default:
          return document.location.origin + "/" + itemPath;
      }

    default:
      switch (document.location.href.includes("admin")) {
        case false:
          switch (document.location.href.endsWith("/")) {
            case true:
              return document.location.href + itemPath;

            default:
              return document.location.href + "/" + itemPath;
          }

        default:
          switch (!!document.location.hash) {
            case true:
              return (
                document.location.href.slice(
                  0,
                  document.location.href.indexOf("#")
                ) + itemPath
              );

            default:
              return document.location.origin + "/" + itemPath;
          }
      }
  }
};
