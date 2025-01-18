export class BaseController {
    protected getKeys(results: unknown[]): string[] {
        return Object.keys(results[0] as object);
      }
    
      protected getValues(results: unknown[]): string[] {
        return Object.values(results[0] as object);
      }
}