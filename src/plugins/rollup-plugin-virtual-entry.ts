
export interface IOptions {
    realEntry?: string;
}

function virtualEntry(options: IOptions = {}) {
    const { realEntry } = options;

    return {
        name: 'virtual-entry',
        resolveId(id: string) {
            if (id === 'virtual:entry') {
                return id;
            }
            // 解析从虚拟入口导入的真实入口
            if (id === './index.tsx' && realEntry) {
                return realEntry;
            }
        },
        load(id: string) {
            if (id === 'virtual:entry') {
                return `
import App from "./index.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
`;
            }
        }
    };
}

export default virtualEntry;
