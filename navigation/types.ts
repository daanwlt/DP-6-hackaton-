export type RootStackParamList = {
  Home: undefined;
  RoosterOverzicht: undefined;
  RoosterToevoegen: undefined;
  Instellingen: undefined;
  RouteBevestiging: undefined;
  /** Zelfde UI als RouteBevestiging; aparte route voor latere differentiatie. */
  ZelfLokaalInvoeren: undefined;
  Plattegrond: {
    startBuilding: string;
    startRoom: string;
    destBuilding: string;
    destRoom: string;
    invalide: boolean;
  };
  PlattegrondKaart: undefined;
  /** Cameraweergave voor stap-voor-stap navigatie (vanaf plattegrond-route). */
  CameraNavigatie: undefined;
};
