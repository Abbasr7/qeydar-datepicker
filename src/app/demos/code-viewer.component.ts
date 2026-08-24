import { Component, Input } from '@angular/core';

let codeViewerId = 0;

@Component({
  selector: 'demo-code-viewer',
  template: `
    <div class="demo-code-viewer">
      <div class="demo-code-bar">
        <button
          type="button"
          class="demo-code-toggle"
          (click)="toggle()"
          [attr.aria-expanded]="open"
          [attr.aria-controls]="panelId"
        >
          <span>{{ open ? 'Hide' : 'Show' }} code</span>
          <span class="demo-code-arrow" aria-hidden="true">↘</span>
        </button>
        @if (open) {
          <div
            class="demo-file-tabs"
            role="tablist"
            aria-label="Code files"
          >
            <button
              type="button"
              role="tab"
              class="demo-file-tab"
              [class.active]="tab === 'html'"
              [attr.aria-selected]="tab === 'html'"
              (click)="tab = 'html'"
            >
              {{ htmlFile }}
            </button>
            <button
              type="button"
              role="tab"
              class="demo-file-tab"
              [class.active]="tab === 'ts'"
              [attr.aria-selected]="tab === 'ts'"
              (click)="tab = 'ts'"
            >
              {{ tsFile }}
            </button>
            @if (scssCode) {
              <button
                type="button"
                role="tab"
                class="demo-file-tab"
                [class.active]="tab === 'scss'"
                [attr.aria-selected]="tab === 'scss'"
                (click)="tab = 'scss'"
              >
                {{ scssFile }}
              </button>
            }
          </div>
        }
        @if (open) {
          <button
            type="button"
            class="demo-copy-btn"
            (click)="copy()"
          >
            {{ copied ? 'Copied ✓' : 'Copy' }}
          </button>
        }
      </div>
      <pre
        id="{{ panelId }}"
        class="demo-code-block"
        [hidden]="!open || tab !== 'html'"
      ><code>{{ htmlCode }}</code></pre>
      <pre
        class="demo-code-block"
        [hidden]="!open || tab !== 'ts'"
      ><code>{{ tsCode }}</code></pre>
      <pre
        class="demo-code-block"
        [hidden]="!open || tab !== 'scss'"
      ><code>{{ scssCode }}</code></pre>
    </div>
  `,
  styles: [
    `
      :host {
        position: relative;
        z-index: 1;
        display: block;
      }

      .demo-code-viewer {
        margin-top: 14px;
      }

      .demo-code-bar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
      }

      .demo-code-toggle {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 0;
        border: 0;
        background: transparent;
        color: #344dc7;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
      }

      .demo-code-toggle:hover {
        color: #4d68e9;
      }

      .demo-code-toggle:focus-visible {
        outline: 2px solid rgba(77, 104, 233, 0.4);
        outline-offset: 3px;
        border-radius: 4px;
      }

      .demo-code-arrow {
        display: inline-block;
        font-size: 14px;
        transition: transform 160ms ease;
      }

      .demo-code-toggle[aria-expanded='true'] .demo-code-arrow {
        transform: rotate(90deg);
      }

      .demo-file-tabs {
        display: inline-flex;
        gap: 2px;
        padding: 3px;
        border-radius: 9px;
        background: #eceff7;
      }

      .demo-file-tab {
        padding: 4px 10px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #6b7588;
        font-family: 'Courier New', monospace;
        font-size: 10px;
        cursor: pointer;
        transition:
          background 140ms ease,
          color 140ms ease;
      }

      .demo-file-tab:hover {
        color: #344dc7;
      }

      .demo-file-tab.active {
        background: #fff;
        color: #344dc7;
        font-weight: 700;
        box-shadow: 0 1px 3px rgba(28, 43, 78, 0.12);
      }

      .demo-copy-btn {
        margin-left: auto;
        padding: 4px 10px;
        border: 1px solid #d9e0f2;
        border-radius: 7px;
        background: #fff;
        color: #56627a;
        font-size: 10px;
        font-weight: 700;
        cursor: pointer;
        transition:
          border-color 140ms ease,
          color 140ms ease;
      }

      .demo-copy-btn:hover {
        border-color: #b8c3de;
        color: #344dc7;
      }

      .demo-code-block {
        max-height: 330px;
        margin: 12px 0 0;
        padding: 15px;
        overflow: auto;
        border: 1px solid #202d48;
        border-radius: 11px;
        background: #19243b;
        color: #d8e2ff;
        direction: ltr;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        line-height: 1.65;
        white-space: pre;
      }

      @media (max-width: 680px) {
        .demo-code-bar {
          gap: 8px;
        }

        .demo-copy-btn {
          margin-left: 0;
        }
      }
    `,
  ],
})
export class DemoCodeViewerComponent {
  @Input() htmlCode = '';
  @Input() tsCode = '';
  @Input() scssCode = '';
  @Input() htmlFile = 'example.component.html';
  @Input() tsFile = 'example.component.ts';
  @Input() scssFile = 'example.component.scss';

  open = false;
  tab: 'html' | 'ts' | 'scss' = 'html';
  copied = false;
  panelId = `demo-code-panel-${++codeViewerId}`;

  toggle(): void {
    this.open = !this.open;
    if (!this.open) {
      this.copied = false;
    }
  }

  async copy(): Promise<void> {
    const text = this.activeCode();
    try {
      await navigator.clipboard.writeText(text);
      this.copied = true;
      setTimeout(() => (this.copied = false), 1600);
    } catch {
      this.copied = false;
    }
  }

  private activeCode(): string {
    if (this.tab === 'ts') {
      return this.tsCode;
    }
    if (this.tab === 'scss') {
      return this.scssCode;
    }
    return this.htmlCode;
  }
}