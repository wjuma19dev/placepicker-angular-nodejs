export interface Place {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  lat: number;
  lon: number;
}

export interface IResponse {
  places: IPlace[]
}
export interface IPlace {
  id:    string;
  title: string;
  image: Image;
  lat:   number;
  lon:   number;
}
export interface Image {
  src: string;
  alt: string;
}
