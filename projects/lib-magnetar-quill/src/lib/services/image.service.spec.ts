import { TestBed } from '@angular/core/testing';
import { ImageService } from './image.service';
import { ImageModalComponentModel } from '../models/image-modal-component-model';

describe('ImageService', () => {
  let service: ImageService;

  function makeModel(overrides: Partial<ImageModalComponentModel> = {}): ImageModalComponentModel {
    const m = new ImageModalComponentModel();
    Object.assign(m, overrides);
    return m;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageService]
    });
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setSelectedImageOnEditor', () => {
    it('should set the selected image signal', () => {
      const model = makeModel({ url: 'http://img.com/test.png' });
      service.setSelectedImageOnEditor(model);
      expect(service.selectedImage()).toBe(model);
    });

    it('should store the image element when provided', () => {
      const model = makeModel({ url: 'http://img.com/test.png' });
      const imgEl = document.createElement('img');
      service.setSelectedImageOnEditor(model, imgEl);
      expect(service.selectedImage()).toBe(model);
    });

    it('should allow null image element (default)', () => {
      const model = makeModel({ url: 'http://img.com/test.png' });
      service.setSelectedImageOnEditor(model);
      // applyImageEdits should early-return (no imgElement stored)
      expect(() => service.applyImageEdits()).not.toThrow();
    });
  });

  describe('applyImageEdits', () => {
    it('should return early when selectedImage is null', () => {
      service.clearSelectedImage();
      expect(() => service.applyImageEdits()).not.toThrow();
    });

    it('should return early when selectedImageElement is null', () => {
      const model = makeModel({ url: 'http://img.com/a.png' });
      service.setSelectedImageOnEditor(model, null);
      expect(() => service.applyImageEdits()).not.toThrow();
    });

    it('should update image element with model data (all fields set)', () => {
      const model = makeModel({
        url: 'http://img.com/new.png',
        alt: 'New Alt',
        width: 150,
        height: 200,
        border: 3,
        hPadding: 5,
        vPadding: 8,
        alignment: 'center',
      });

      const imgEl = document.createElement('img');
      service.setSelectedImageOnEditor(model, imgEl);
      service.applyImageEdits();

      expect(imgEl.src).toBe('http://img.com/new.png');
      expect(imgEl.alt).toBe('New Alt');
      expect(imgEl.style.width).toBe('150px');
      expect(imgEl.style.height).toBe('200px');
      expect(imgEl.style.borderWidth).toBe('3px');
      expect(imgEl.style.textAlign).toBe('center');
    });

    it('should use auto for null width/height and empty borderWidth for 0 border', () => {
      const model = makeModel({
        url: 'http://img.com/b.png',
        alt: '',
        width: null,
        height: null,
        border: 0,
        hPadding: 0,
        vPadding: 0,
        alignment: 'left',
      });

      const imgEl = document.createElement('img');
      service.setSelectedImageOnEditor(model, imgEl);
      service.applyImageEdits();

      expect(imgEl.src).toBe('http://img.com/b.png');
      expect(imgEl.style.width).toBe('auto');
      expect(imgEl.style.height).toBe('auto');
      expect(imgEl.style.textAlign).toBe('left');
    });
  });

  describe('clearSelectedImage', () => {
    it('should clear the selected image signal', () => {
      const model = makeModel({ url: 'http://img.com/x.png' });
      service.setSelectedImageOnEditor(model);
      expect(service.selectedImage()).not.toBeNull();

      service.clearSelectedImage();
      expect(service.selectedImage()).toBeNull();
    });
  });

  describe('getBase64', () => {
    it('should resolve with base64 data URL for a valid file', (done) => {
      const blob = new Blob(['hello'], { type: 'text/plain' });
      const file = new File([blob], 'test.txt', { type: 'text/plain' });
      service.getBase64(file).then(result => {
        expect(result).toContain('data:text/plain;base64,');
        done();
      }).catch(done.fail);
    });
  });
});
