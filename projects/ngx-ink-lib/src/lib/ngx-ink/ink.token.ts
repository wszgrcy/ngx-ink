import { InjectionToken } from '@angular/core';
import { Options } from './ink';
export type InkOption = Options;
export const InkOptionToken = new InjectionToken<InkOption>('InkOptionToken');
