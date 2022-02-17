import React, { forwardRef, useRef } from "react";
import {
  ItemContent,
  ItemProps,
  Virtuoso,
  VirtuosoHandle,
} from "react-virtuoso";

type InfinateScrollGridProps<D> = {
  data: readonly D[];
  endReached?: (index: number) => void;
  itemContent?: ItemContent<D>;
  hasMoreData?: boolean;
  isLoadingNext?: boolean;
};

const List = forwardRef<HTMLDivElement>(
  (
    {
      style,
      ...props
    }: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    ref
  ) => {
    return (
      <div
        className="snap-y first:mt-4 px-4 space-y-4 box"
        style={{
          ...style,
          marginTop: undefined,
        }}
        {...props}
        ref={ref}
      />
    );
  }
);

const FancyScroller = React.forwardRef(
  ({ children, ...props }, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div {...props} ref={ref}>
        {children}
      </div>
    );
  }
);

const Item = forwardRef<HTMLDivElement, ItemProps>((props, ref) => {
  return <div className="snap-start" {...props} ref={ref} />;
});

export function InfinateScrollGrid<D>({
  data,
  itemContent,
  hasMoreData,
  endReached,
  isLoadingNext,
}: InfinateScrollGridProps<D>) {
  const virtuoso = useRef<VirtuosoHandle>(null);

  return (
    <Virtuoso
      ref={virtuoso}
      data={data}
      endReached={endReached}
      itemContent={itemContent}
      useWindowScroll={true}
      components={{
        Scroller: FancyScroller,
        List,
        Item,
        Footer: () => {
          return (
            <div className="w-full p-2 text-center">
              {isLoadingNext && "Loading..."}
              {!hasMoreData && "No More Data"}
            </div>
          );
        },
      }}
    />
  );
}
