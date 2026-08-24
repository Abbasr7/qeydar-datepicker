import { Directive, TemplateRef, isDevMode, input, inject } from "@angular/core";

@Directive({
    selector: '[Template],[qeydarTemplate]',
    host: {}
})
export class CustomTemplate {
    template = inject<TemplateRef<any>>(TemplateRef);

    readonly type = input<string>();

    readonly name = input<string>(undefined, { alias: "Template" });
    readonly qeydarTemplateName = input<string>(undefined, { alias: "qeydarTemplate" });

    getType(): string {
        const templateType = this.name() || this.qeydarTemplateName() || this.type() || '';
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
