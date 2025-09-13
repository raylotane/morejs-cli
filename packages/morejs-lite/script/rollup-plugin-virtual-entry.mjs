

function virtualEntry(options = {}) {
    const { realEntry } = options;

    return {
        name: 'virtual-entry',
        resolveId(id) {
            if (id === 'virtual:entry') {
                return id;
            }
            // 解析从虚拟入口导入的真实入口
            if (id === './index.tsx' && realEntry) {
                return realEntry;
            }
        },
        load(id) {
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

export default virtualEntry
