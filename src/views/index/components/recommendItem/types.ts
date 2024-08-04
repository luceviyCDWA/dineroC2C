export interface IRecommendItem {
  id: string;
  name: string;
  image: string;
  buyPrice: number;
  buyCurrency: string;
  sellPrice: number;
  sellCurrency: string;
}

export interface IBannerList {
  id: string;
  image: string;
  url?: string;
} 