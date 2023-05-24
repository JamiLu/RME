import { createApp } from '../src/index';
import { ClickAndShowExample } from '../demo/clickerExample/clickAndShowComponents'
import { TodoExample } from '../demo/todoExample/todoComponents';
import { FormExample } from '../demo/formExample/formComponents';
import { FilterExample } from '../demo/filterExample/filterComponents';

createApp({
    '#app': {
        'div.w3-container': {
            ClickAndShowExample,
            TodoExample,
            FormExample,
            FilterExample
        }
    }
});
