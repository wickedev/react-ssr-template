export function message(error: Error): string {
  return (error as any).source.errors
    .flatMap((e: any) => Object.values(e.extensions))
    .map((e: any) => e.message)
    .join(", ");
}
