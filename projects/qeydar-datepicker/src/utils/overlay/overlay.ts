/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/../blob/master/LICENSE
 */

import {
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    ConnectedOverlayPositionChange,
    FlexibleConnectedPositionStrategyOrigin,
    ConnectionPositionPair
} from '@angular/cdk/overlay';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, Input, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type SafeAny = any;

function propDecoratorFactory<T, D>(
    name: string,
    fallback: (v: T) => D
): (target: SafeAny, propName: string) => void {
    function propDecorator(
        target: SafeAny,
        propName: string,
        originalDescriptor?: TypedPropertyDescriptor<SafeAny>
    ): SafeAny {
        const privatePropName = `$$__zorroPropDecorator__${propName}`;

        if (Object.prototype.hasOwnProperty.call(target, privatePropName)) {
            console.warn(`The prop "${privatePropName}" is already exist, it will be overrided by ${name} decorator.`);
        }

        Object.defineProperty(target, privatePropName, {
            configurable: true,
            writable: true
        });

        return {
            get(): string {
                return originalDescriptor && originalDescriptor.get
                    ? originalDescriptor.get.bind(this)()
                    : this[privatePropName];
            },
            set(value: T): void {
                if (originalDescriptor && originalDescriptor.set) {
                    originalDescriptor.set.bind(this)(fallback(value));
                }
                this[privatePropName] = fallback(value);
            }
        };
    }

    return propDecorator;
}

/**
 * Input decorator that handle a prop to do get/set automatically with toBoolean
 *
 * Why not using @InputBoolean alone without @Input? AOT needs @Input to be visible
 *
 * @howToUse
 * ```
 * @Input() @InputBoolean() visible: boolean = false;
 *
 * // Act as below:
 * // @Input()
 * // get visible() { return this.__visible; }
 * // set visible(value) { this.__visible = value; }
 * // __visible = false;
 * ```
 */
export function InputBoolean(): any {
    return propDecoratorFactory('InputBoolean', toBoolean);
}

export function toBoolean(value: boolean | string): boolean {
    return coerceBooleanProperty(value);
}

/** Equivalent of `ClientRect` without some of the properties we don't care about. */
type Dimensions = Omit<ClientRect, 'x' | 'y' | 'toJSON'>;

@Directive({
    selector: '[cdkConnectedOverlay][nzConnectedOverlay]',
    exportAs: 'nzConnectedOverlay',
    standalone: true
})
export class NzConnectedOverlayDirective {
    @Input() @InputBoolean() nzArrowPointAtCenter: boolean = false;
    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly cdkConnectedOverlay: CdkConnectedOverlay
    ) {
        this.cdkConnectedOverlay.backdropClass = 'nz-overlay-transparent-backdrop';

        this.cdkConnectedOverlay.positionChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((position: ConnectedOverlayPositionChange) => {
                if (this.nzArrowPointAtCenter) {
                    this.updateArrowPosition(position);
                }
            });
    }

    private updateArrowPosition(position: ConnectedOverlayPositionChange): void {
        const originRect = this.getOriginRect();
        const placement = getPlacementName(position);

        let offsetX: number | undefined = 0;
        let offsetY: number | undefined = 0;

        if (placement === 'topLeft' || placement === 'bottomLeft') {
            offsetX = originRect.width / 2 - 14;
        } else if (placement === 'topRight' || placement === 'bottomRight') {
            offsetX = -(originRect.width / 2 - 14);
        } else if (placement === 'leftTop' || placement === 'rightTop') {
            offsetY = originRect.height / 2 - 10;
        } else if (placement === 'leftBottom' || placement === 'rightBottom') {
            offsetY = -(originRect.height / 2 - 10);
        }

        if (this.cdkConnectedOverlay.offsetX !== offsetX || this.cdkConnectedOverlay.offsetY !== offsetY) {
            this.cdkConnectedOverlay.offsetY = offsetY;
            this.cdkConnectedOverlay.offsetX = offsetX;
            this.cdkConnectedOverlay.overlayRef.updatePosition();
        }
    }

    private getFlexibleConnectedPositionStrategyOrigin(): FlexibleConnectedPositionStrategyOrigin {
        if (this.cdkConnectedOverlay.origin instanceof CdkOverlayOrigin) {
            return this.cdkConnectedOverlay.origin.elementRef;
        } else {
            return this.cdkConnectedOverlay.origin;
        }
    }

    private getOriginRect(): Dimensions {
        const origin = this.getFlexibleConnectedPositionStrategyOrigin();

        if (origin instanceof ElementRef) {
            return origin.nativeElement.getBoundingClientRect();
        }

        // Check for Element so SVG elements are also supported.
        if (origin instanceof Element) {
            return origin.getBoundingClientRect();
        }

        const width = origin.width || 0;
        const height = origin.height || 0;
        
        // If the origin is a point, return a client rect as if it was a 0x0 element at the point.
        return {
            top: origin.y,
            bottom: origin.y + height,
            left: origin.x,
            right: origin.x + width,
            height,
            width
        };
    }
}

//overlay-position.ts:
export const POSITION_MAP = {
    top: new ConnectionPositionPair({ originX: 'center', originY: 'top' }, { overlayX: 'center', overlayY: 'bottom' }),
    topCenter: new ConnectionPositionPair(
      { originX: 'center', originY: 'top' },
      { overlayX: 'center', overlayY: 'bottom' }
    ),
    topLeft: new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
    topRight: new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
    right: new ConnectionPositionPair({ originX: 'end', originY: 'center' }, { overlayX: 'start', overlayY: 'center' }),
    rightTop: new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' }),
    rightBottom: new ConnectionPositionPair(
      { originX: 'end', originY: 'bottom' },
      { overlayX: 'start', overlayY: 'bottom' }
    ),
    bottom: new ConnectionPositionPair({ originX: 'center', originY: 'bottom' }, { overlayX: 'center', overlayY: 'top' }),
    bottomCenter: new ConnectionPositionPair(
      { originX: 'center', originY: 'bottom' },
      { overlayX: 'center', overlayY: 'top' }
    ),
    bottomLeft: new ConnectionPositionPair(
      { originX: 'start', originY: 'bottom' },
      { overlayX: 'start', overlayY: 'top' }
    ),
    bottomRight: new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
    left: new ConnectionPositionPair({ originX: 'start', originY: 'center' }, { overlayX: 'end', overlayY: 'center' }),
    leftTop: new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'end', overlayY: 'top' }),
    leftBottom: new ConnectionPositionPair(
      { originX: 'start', originY: 'bottom' },
      { overlayX: 'end', overlayY: 'bottom' }
    )
  };
export type POSITION_TYPE = keyof typeof POSITION_MAP;
export type POSITION_TYPE_HORIZONTAL = Extract<
  POSITION_TYPE,
  'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight'
>;

export const DEFAULT_TOOLTIP_POSITIONS = [POSITION_MAP.top, POSITION_MAP.right, POSITION_MAP.bottom, POSITION_MAP.left];

export const DEFAULT_CASCADER_POSITIONS = [
  POSITION_MAP.bottomLeft,
  POSITION_MAP.bottomRight,
  POSITION_MAP.topLeft,
  POSITION_MAP.topRight,
  POSITION_MAP.topCenter,
  POSITION_MAP.bottomCenter
];

export const DEFAULT_MENTION_TOP_POSITIONS = [
  new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'bottom' }),
  new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'end', overlayY: 'bottom' })
];

export const DEFAULT_MENTION_BOTTOM_POSITIONS = [
  POSITION_MAP.bottomLeft,
  new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' })
];

export function getPlacementName(position: ConnectedOverlayPositionChange): string | undefined {
  for (const placement in POSITION_MAP) {
    if (
      position.connectionPair.originX === POSITION_MAP[placement as POSITION_TYPE].originX &&
      position.connectionPair.originY === POSITION_MAP[placement as POSITION_TYPE].originY &&
      position.connectionPair.overlayX === POSITION_MAP[placement as POSITION_TYPE].overlayX &&
      position.connectionPair.overlayY === POSITION_MAP[placement as POSITION_TYPE].overlayY
    ) {
      return placement;
    }
  }
  return undefined;
}

export const DATE_PICKER_POSITION_MAP = {
  bottomLeft: new ConnectionPositionPair(
    { originX: 'start', originY: 'bottom' },
    { overlayX: 'start', overlayY: 'top' },
    undefined,
    2
  ),
  topLeft: new ConnectionPositionPair(
    { originX: 'start', originY: 'top' },
    { overlayX: 'start', overlayY: 'bottom' },
    undefined,
    -2
  ),
  bottomRight: new ConnectionPositionPair(
    { originX: 'end', originY: 'bottom' },
    { overlayX: 'end', overlayY: 'top' },
    undefined,
    2
  ),
  topRight: new ConnectionPositionPair(
    { originX: 'end', originY: 'top' },
    { overlayX: 'end', overlayY: 'bottom' },
    undefined,
    -2
  )
};

export const DEFAULT_DATE_PICKER_POSITIONS = [
  DATE_PICKER_POSITION_MAP.bottomLeft,
  DATE_PICKER_POSITION_MAP.topLeft,
  DATE_PICKER_POSITION_MAP.bottomRight,
  DATE_PICKER_POSITION_MAP.topRight
];
  