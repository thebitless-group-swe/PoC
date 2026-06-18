import type { components } from './api';


//usato Facade design pattern per esporre solo i tipi reali del backend, nascondendo quelli generati da openapi-typescript
// Esportazione centralizzata dei tipi reali del backend
export type GenerateRequest = components['schemas']['GenerateRequest'];
export type LinkRequest = components['schemas']['LinkRequest'];
export type TextRequest = components['schemas']['TextRequest'];
export type ValidationError = components['schemas']['ValidationError'];
export type HTTPValidationError = components['schemas']['HTTPValidationError'];