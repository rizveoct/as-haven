// truncate-words.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWords',
  standalone: true, // set to false if you're adding it to an NgModule instead
})
export class TruncateWordsPipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    wordLimit = 20,
    suffix = '...'
  ): string {
    if (!value) return '';
    const words = value.trim().split(/\s+/);
    if (words.length <= wordLimit) return value;
    return words.slice(0, wordLimit).join(' ') + suffix;
  }
}
