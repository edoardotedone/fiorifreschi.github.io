export interface PosterState {
  format: '4:5' | '9:16';
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  subtitle: string;
  date: string;
  description: string;
  extraInfo: string;
  time: string;
  footerText: string;
  logoUrl: string | null;
  titleImageUrl: string | null;
  bodyFont: 'space' | 'work';
  contentFontSizeScale: number;
  contentLineHeight: number;
}

export const initialState: PosterState = {
  format: '4:5',
  primaryColor: '#FBB034',
  backgroundColor: '#5C5C60',
  textColor: '#FFFFFF',
  subtitle: 'incontri di critica e poesia contemporanea, in libreria',
  date: 'GIO _26/02_',
  description: '_Procne Machine_ di _Carmen Gallo_ (Einaudi).\nIntroduce _Andrea Cortellessa_. Interviene _Emiliano Ceresi_. Visual di _Edoardo Tedone_.',
  extraInfo: 'Letture dell\'autrice',
  time: 'ore 18.30',
  footerText: 'TOMO LIBRERIA - VIA DEGLI ETRUSCHI, 4-14',
  logoUrl: null,
  titleImageUrl: null,
  bodyFont: 'space',
  contentFontSizeScale: 1,
  contentLineHeight: 1.35
};
