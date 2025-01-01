export class ImageModalComponentModel {
  public url: string = '';
  public alt: string = '';
  public width: number | null = null;
  public height: number | null = null;
  public border: number = 0;
  public hPadding: number = 0;
  public vPadding: number = 0;
  public alignment: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'stretch' | 'justify-all' = 'left';
}
