import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isClicked:boolean = false; // Here we are binding class array

  constructor(private elemRef:ElementRef,private render:Renderer2) { }

  // @HostListener('mouseenter') mouseHover(){
  //   this.render.addClass(this.elemRef.nativeElement,'open');
  // }

  // @HostListener('mouseleave') mouseLeave(){
  //   this.render.removeClass(this.elemRef.nativeElement,'open');
  // }

  @HostListener('click') toggleClick(){
    this.isClicked = ! this.isClicked;
    // if (this.isClicked) {
    //   this.render.addClass(this.elemRef.nativeElement,'open');
    // }
    // else {
    //   this.render.removeClass(this.elemRef.nativeElement,'open');
    // }
  }

}
