import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appAutoTab]'
})
export class AutoTabDirective {
  @Input('appAutoTab') appAutoTab

  @HostListener('input', ['$event.target']) onInput(input) {

    const length = input.value.length
    const maxLength = input.attributes.maxlength.value
    const inputLenght = 0
    if (length >= maxLength) {
      this.appAutoTab.focus()
    }
  }

}