'use client';
import * as React from 'react';
import { Button } from './button';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';
import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarouselCtx() {
  const context = React.useContext(CarouselContext);

  if (!context) throw new Error('useCarousel must be used within a <Carousel />');

  return context;
}

export function useCarousel(opts?: CarouselOptions, plugins?: CarouselPlugin) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: opts?.dragFree || true, loop: opts?.loop || true, ...opts }, plugins);
  // default carousel
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const handlePrev = React.useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const handleNext = React.useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleKeyDownCapture = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
    },
    [handlePrev, handleNext]
  );

  React.useEffect(() => {
    if (!emblaApi) {
      return;
    }
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi?.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // like a logo carousel
  const [isPlaying, setIsPlaying] = React.useState(true);

  React.useEffect(() => {
    const autoScroll = (emblaApi as any)?.plugins()?.autoScroll;
    if (!autoScroll) return;

    if (isPlaying) autoScroll?.play();
    else autoScroll?.stop();

    setIsPlaying(autoScroll?.isPlaying());
    (emblaApi as any)
      .on('autoScroll:play', () => setIsPlaying(true))
      .on('autoScroll:stop', () => setIsPlaying(false))
      .on('reInit', () => setIsPlaying(autoScroll?.isPlaying()));
  }, [emblaApi, isPlaying]);

  const stopCarousel = () => setIsPlaying(false);
  const startCarousel = () => setIsPlaying(true);

  return {
    emblaRef,
    stopCarousel,
    startCarousel,
    handlePrev,
    handleNext,
    canScrollPrev,
    canScrollNext,
    handleKeyDownCapture
  };
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(function Carousel(
  { orientation = 'horizontal', opts, setApi, plugins, className, children, ...props },
  ref
) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y'
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext
      }}
    >
      <div ref={ref} onKeyDownCapture={handleKeyDown} className={twMerge('relative', className)} role="region" data-carousel="root" aria-roledescription="carousel" {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    unstyled?: boolean;
    classNames?: Partial<Record<'wrapper' | 'inner', string>>;
  }
>(function CarouselContent({ unstyled, className, classNames, ...props }, ref) {
  const { carouselRef, orientation } = useCarouselCtx();

  return (
    <div ref={carouselRef} data-carousel="wrapper" className={twMerge('overflow-hidden', classNames?.wrapper)}>
      <div
        ref={ref}
        data-carousel="inner"
        className={twMerge(!unstyled && (orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col'), !unstyled && 'flex', className, classNames?.inner)}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem1 = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { unstyled?: boolean }>(function CarouselItem1({ unstyled, className, ...props }, ref) {
  const { orientation } = useCarouselCtx();

  return (
    <div
      ref={ref}
      role="group"
      data-carousel="item"
      aria-roledescription="slide"
      className={twMerge(!unstyled && 'min-w-0 shrink-0 grow-0 basis-full', !unstyled && (orientation === 'horizontal' ? 'pl-4' : 'pt-4'), className)}
      {...props}
    />
  );
});
CarouselItem1.displayName = 'CarouselItem1';

interface CarouselItemProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  ref?: React.Ref<HTMLElement> | undefined;
  /** @default <div> */
  el?: React.ElementType;
  /** @default false */
  asChild?: boolean;
  /** @default false */
  unstyled?: boolean;
  rel?: string;
  href?: string;
  target?: string;
  type?: 'button' | 'submit' | 'reset';
}

const CarouselItem = React.forwardRef<HTMLElement, CarouselItemProps>(function CarouselItem({ className, asChild = false, el = 'div', unstyled, ...props }, ref) {
  const { api, setApi } = useCarouselCtx();

  const setEl: React.ComponentType<React.HTMLAttributes<HTMLElement>> = el as React.ComponentType<React.HTMLAttributes<HTMLElement>>;

  const Item = asChild ? Slot : setEl;

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  const attrItem = {
    ref,
    role: 'group',
    'aria-roledescription': 'slide',
    className: twMerge(!unstyled && 'min-w-0 shrink-0 grow-0 basis-full', className),
    ...props
  };

  return <Item {...attrItem} />;
});
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button> & { unstyled?: boolean }>(function CarouselPrevious(
  { className, variant = 'outline', size = 'icon', unstyled, ...props },
  ref
) {
  const { orientation, scrollPrev, canScrollPrev } = useCarouselCtx();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      title="Previous slide"
      data-carousel="previous-slide"
      aria-label="Previous slide"
      unstyled={unstyled}
      className={twMerge(
        !unstyled && ['absolute [--sz:24px] rounded-full', orientation === 'horizontal' ? '-left-12 top-1/2 -translate-y-1/2' : '-top-12 left-1/2 -translate-x-1/2 rotate-90'],
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="1"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height="1em"
        width="1em"
        className="size-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M13 15l-3 -3l3 -3" />
        <path d="M21 12a9 9 0 1 0 -18 0a9 9 0 0 0 18 0z" />
      </svg>
    </Button>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button> & { unstyled?: boolean }>(function CarouselNext(
  { className, variant = 'outline', size = 'icon', unstyled, ...props },
  ref
) {
  const { orientation, scrollNext, canScrollNext } = useCarouselCtx();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      title="Next slide"
      aria-label="Next slide"
      data-carousel="next-slide"
      unstyled={unstyled}
      className={twMerge(
        !unstyled && ['absolute [--sz:24px] rounded-full', orientation === 'horizontal' ? '-right-12 top-1/2 -translate-y-1/2' : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90'],
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="1"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height="1em"
        width="1em"
        className="size-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11 9l3 3l-3 3" />
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0z" />
      </svg>
    </Button>
  );
});
CarouselNext.displayName = 'CarouselNext';

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

export const useDotButton = (emblaApi: EmblaCarouselType | undefined, onButtonClick?: (emblaApi: EmblaCarouselType) => void): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onDotButtonClick = React.useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      if (onButtonClick) onButtonClick(emblaApi);
    },
    [emblaApi, onButtonClick]
  );

  const onInit = React.useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick
  };
};

const CarouselDot = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(function CarouselDot({ className, ...props }, ref) {
  const { orientation, api } = useCarouselCtx();
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);

  return (
    <div role="group" data-orientation={orientation} className={className}>
      {scrollSnaps.map((_, index) => (
        <button
          ref={ref}
          key={index}
          type="button"
          aria-label={`slide:${index + 1}`}
          onClick={() => onDotButtonClick(index)}
          {...props}
          data-state={index === selectedIndex ? 'active' : undefined}
        />
      ))}
    </div>
  );
});
CarouselDot.displayName = 'CarouselDot';

const PLACEHOLDER_SRC = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

type CarouselLazyLoadType = {
  src: string;
  inView: boolean;
  index: number;
  fallback?: React.ReactNode;
} & React.ComponentProps<'img'>;

const CarouselLazyLoad = React.forwardRef<HTMLImageElement, CarouselLazyLoadType>(function CarouselLazyLoad({ className, src, inView, fallback, ...props }, ref) {
  const [hasLoaded, setHasLoaded] = React.useState(false);

  const setLoaded = React.useCallback(() => {
    if (inView) setHasLoaded(true);
  }, [inView, setHasLoaded]);

  return (
    <div className={twMerge('min-w-0 [flex:0_0_100%] relative flex items-center justify-center', className)}>
      {!hasLoaded && fallback}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        className={twMerge('w-full h-full', hasLoaded ? ' opacity-100' : 'opacity-0')}
        onLoad={setLoaded}
        src={inView ? src : PLACEHOLDER_SRC}
        alt="Your alt text"
        data-src={src}
        {...props}
      />
    </div>
  );
});
CarouselLazyLoad.displayName = 'CarouselLazyLoad';

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDot, CarouselLazyLoad };
