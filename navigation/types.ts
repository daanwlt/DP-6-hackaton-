export type RootStackParamList = {
  Home: undefined;
  RoosterOverzicht: undefined;
  RoosterToevoegen: undefined;
  Instellingen: undefined;
  RouteBevestiging: undefined;
  Plattegrond: {
    startBuilding: string;
    startRoom: string;
    destBuilding: string;
    destRoom: string;
    invalide: boolean;
  };
  PlattegrondKaart: undefined;
};
