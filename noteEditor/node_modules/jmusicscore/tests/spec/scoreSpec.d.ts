import Model = JMusicScore.Model;
declare var initScore: any;
declare var initApp1: {
    "id": string;
    "t": string;
    "def": {
        "metadata": {};
    };
    "children": ({
        "id": string;
        "t": string;
        "def": {
            "abs": {
                "num": number;
                "den": number;
            };
        };
    } | {
        "id": string;
        "t": string;
        "def": {
            "abs": {
                "num": number;
                "den": number;
            };
            "def": {
                "t": string;
                "num": number;
                "den": number;
            };
        };
    } | {
        "id": string;
        "t": string;
        "children": ({
            "id": string;
            "t": string;
            "def": {
                "abs": {
                    "num": number;
                    "den": number;
                };
                "clef": number;
                "lin": number;
                "tr": number;
            };
        } | {
            "id": string;
            "t": string;
            "def": {
                "abs": {
                    "num": number;
                    "den": number;
                };
                "def": {
                    "t": string;
                    "acci": string;
                    "no": number;
                };
            };
        } | {
            "id": string;
            "t": string;
            "def": {
                "stem": number;
            };
            "children": ({
                "id": string;
                "t": string;
                "def": {
                    "time": {
                        "num": number;
                        "den": number;
                    };
                    "abs": {
                        "num": number;
                        "den": number;
                    };
                    "noteId": string;
                    "dots": number;
                    "rest": boolean;
                };
            } | {
                "id": string;
                "t": string;
                "def": {
                    "time": {
                        "num": number;
                        "den": number;
                    };
                    "abs": {
                        "num": number;
                        "den": number;
                    };
                    "noteId": string;
                };
                "children": ({
                    "id": string;
                    "t": string;
                    "def": {
                        "p": number;
                        "a": string;
                    };
                } | {
                    "id": string;
                    "t": string;
                    "def": {
                        "text": string;
                    };
                })[];
            } | {
                "id": string;
                "t": string;
                "def": {
                    "time": {
                        "num": number;
                        "den": number;
                    };
                    "abs": {
                        "num": number;
                        "den": number;
                    };
                    "noteId": string;
                    "rest": boolean;
                    "hidden": boolean;
                };
            })[];
        } | {
            "id": string;
            "t": string;
            "def": {
                "text": string;
                "abs": {
                    "num": number;
                    "den": number;
                };
            };
        } | {
            "id": string;
            "t": string;
        })[];
    })[];
};
