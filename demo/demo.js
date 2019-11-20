import { App } from '../src/index';
import '../demo/todoExample/todoComponents';
import '../demo/formExample/formComponents';
import '../demo/filterExample/filterComponents';

App.root('#app').create({
    'div.w3-container': [
        {TodoExample: {}},

        {FormExample: {}},
        
        {FilterExample: {}}
    ]
});