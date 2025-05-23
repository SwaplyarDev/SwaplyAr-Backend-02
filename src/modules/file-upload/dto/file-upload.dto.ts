export interface FileUploadDTO{
    fieldName:string,
    originalName:string,
    mimeType:string,
    size:number,
    buffer:Buffer
    }