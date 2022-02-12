import React, { forwardRef, useRef } from "react";
import {
  ItemContent,
  ItemProps,
  Virtuoso,
  VirtuosoHandle
} from "react-virtuoso";

type InfinateScrollGridProps<D> = {
  data: readonly D[];
  endReached?: (index: number) => void;
  itemContent?: ItemContent<D>;
  hasMoreData?: boolean;
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
      <div style={{ border: "1px solid pink" }}>
        <div {...props} ref={ref}>
          {children}
        </div>
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
}: InfinateScrollGridProps<D>) {
  const virtuoso = useRef<VirtuosoHandle>(null);
  return (
    <Virtuoso
      ref={virtuoso}
      className="w-96"
      style={{
        height: 600,
        outline: "1px solid black",
      }}
      data={data}
      endReached={endReached}
      itemContent={itemContent}
      components={{
        Scroller: FancyScroller,
        List,
        Item,
        Footer: () => {
          return (
            <div
              style={{
                padding: "2rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {hasMoreData && "Loading..."}
            </div>
          );
        },
      }}
    />
  );
}
