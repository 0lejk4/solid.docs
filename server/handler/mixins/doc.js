const DocMixin = {
    DOC: {
        handle: async (cmd, handler) => {
            console.log(cmd);

            if (cmd.fromAction) {
                return handler[cmd.fromAction].doc;
            }

            const fullDoc = {};

            Object.keys(handler).forEach(f => fullDoc[f] = handler[f].doc);

            fullDoc.doc = handler.doc;

            return fullDoc;
        },
        doc: 'Doc action',
    },
};

module.exports = DocMixin;
