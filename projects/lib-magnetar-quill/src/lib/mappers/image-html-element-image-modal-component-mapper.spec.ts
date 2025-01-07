import { ImageHtmlElementImageModalComponentMapper } from './image-html-element-image-modal-component-mapper';
import { ImageModalComponentModel } from '../models/image-modal-component-model';

describe('ImageHtmlElementImageModalComponentMapper', () => {
  let mapper: ImageHtmlElementImageModalComponentMapper;

  beforeEach(() => {
    mapper = new ImageHtmlElementImageModalComponentMapper();
  });

  describe('mapImageModalComponentToImageHtmlElement', () => {
    it('should correctly map the ImageModalComponentModel to HTMLImageElement', () => {
      const model = new ImageModalComponentModel();
      model.url = 'https://example.com/image.jpg';
      model.alt = 'Test Image';
      model.width = 200;
      model.height = 300;
      model.border = 5;
      model.hPadding = 10;
      model.vPadding = 15;
      model.alignment = 'center';

      const imageElement = mapper.mapImageModalComponentToImageHtmlElement(model);

      expect(imageElement.src).toBe(model.url);
      expect(imageElement.alt).toBe(model.alt);
      expect(imageElement.style.width).toBe('200px');
      expect(imageElement.style.height).toBe('300px');
      expect(imageElement.style.borderWidth).toBe('5px');
      expect(imageElement.style.padding).toBe('15px 10px');
      expect(imageElement.style.textAlign).toBe(model.alignment);
    });

    it('should handle missing properties and set defaults', () => {
      const model = new ImageModalComponentModel();
      model.url = 'https://example.com/image.jpg';

      const imageElement = mapper.mapImageModalComponentToImageHtmlElement(model);

      expect(imageElement.src).toBe(model.url);
      expect(imageElement.alt).toBe('');
      expect(imageElement.style.width).toBe('auto');
      expect(imageElement.style.height).toBe('auto');
      expect(imageElement.style.borderWidth).toBe('0px');
      expect(imageElement.style.padding).toBe('0px');
      expect(imageElement.style.textAlign).toBe('left');
    });
  });

  describe('mapImageHtmlElementToImageModalComponent', () => {
    it('should correctly map the HTMLImageElement to ImageModalComponentModel', () => {
      const imageElement = document.createElement('img');
      imageElement.src = 'https://example.com/image.jpg';
      imageElement.alt = 'Test Image';
      imageElement.width = 200;
      imageElement.height = 300;
      imageElement.style.borderWidth = '5px';
      imageElement.style.paddingLeft = '10px';
      imageElement.style.paddingTop = '15px';
      imageElement.style.textAlign = 'center';

      const model = mapper.mapImageHtmlElementToImageModalComponent(imageElement);

      expect(model.url).toBe(imageElement.src);
      expect(model.alt).toBe(imageElement.alt);
      expect(model.width).toBe(imageElement.width);
      expect(model.height).toBe(imageElement.height);
      expect(model.border).toBe(5);
      expect(model.hPadding).toBe(10);
      expect(model.vPadding).toBe(15);
      expect(model.alignment).toBe(imageElement.style.textAlign);
    });

    it('should handle missing properties and set defaults', () => {
      const imageElement = document.createElement('img');
      imageElement.src = 'https://example.com/image.jpg';

      const model = mapper.mapImageHtmlElementToImageModalComponent(imageElement);

      expect(model.url).toBe(imageElement.src);
      expect(model.alt).toBe('');
      expect(model.width).toBeNull();
      expect(model.height).toBeNull();
      expect(model.border).toBe(0);
      expect(model.hPadding).toBe(0);
      expect(model.vPadding).toBe(0);
    });
  });
});
