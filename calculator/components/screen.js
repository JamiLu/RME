
import { actions } from './keypad';

const [getOperation] = actions;

const ResultScreen = () => {
    let {statement, result} = getOperation();

    return {
        'div.result-screen': () => {
            const OPS = /(\+|\-|\*|\/)/g;
            let matches = statement.match(OPS) || [];
            statement = statement.split(OPS).reduce((res, val) => {
                let current = val;
                if (matches.indexOf(val) > -1)
                    current = ` ${val} `;
                return res + current;
            }, '');
            if (result)
                return statement.concat(result);
            return statement;
        }
    }
};

Component(ResultScreen);
