import { Directive, Input, TemplateRef, isDevMode } from "@angular/core";

@Directive({
    selector: '[Template],[qeydarTemplate]',
    standalone: true,
    host: {}
})
export class CustomTemplate {
    @Input() type: string | undefined;

    @Input('Template') name: string | undefined;
    @Input('qeydarTemplate') qeydarTemplateName: string | undefined;

    constructor(public template: TemplateRef<any>) {}

    getType(): string {
        const templateType = this.name || this.qeydarTemplateName || this.type || '';
        const supportedTypes = ['day', 'month', 'year', 'toolbar', 'header', 'footer', 'body'];

        if (isDevMode() && templateType && !supportedTypes.includes(templateType)) {
            console.warn(
                `[qeydar-datepicker] Unknown template type "${templateType}". ` +
                `Supported types are: ${supportedTypes.join(', ')}.`
            );
        }

        return templateType;
    }
}
