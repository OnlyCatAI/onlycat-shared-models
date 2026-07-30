function hexToFloatArray(hexString: string): number[] {
    const regex = /.{2}/g; // matches every 2 characters
    const hexPairs = hexString.match(regex) || []; // split into pairs of hex characters
    const array = hexPairs.map((hex) => parseInt(hex, 16) / 255); // decode and scale each pair
    return array;
}

export class FrameClassification {
    NO_CAT?: number;
    CAT_TRANSIT?: number;
    CAT_CLEAR?: number;
    CAT_PREY?: number;
    HUMAN_ACTIVITY?: number;

    constructor(classificationOutputs: number[] | string) {
        if (!classificationOutputs) {
            return;
        }

        if (typeof classificationOutputs === "string") {
            classificationOutputs = hexToFloatArray(classificationOutputs);
        }

        this.NO_CAT = classificationOutputs[0];
        this.CAT_TRANSIT = classificationOutputs[1];
        this.CAT_CLEAR = classificationOutputs[2];
        this.CAT_PREY = classificationOutputs[3];
        this.HUMAN_ACTIVITY = classificationOutputs[4];
    }

    get topK(): [string, number][] {
        // Convert the classes object to an array of label/value pairs
        const arrayOfPairs = Object.entries(this);

        // Sort the array based on the value in descending order
        const sortedPairs = arrayOfPairs.sort((a, b) => b[1] - a[1]);

        return sortedPairs;
    }

    /**
     * Highest-scoring class, or undefined when no score is populated. Unlike
     * `topK` this tolerates a short/absent score vector, since it is what gets
     * persisted as `snapshot.classification_label`.
     */
    get topLabel(): string | undefined {
        let topLabel: string | undefined;
        let topScore = -Infinity;

        for (const [label, score] of Object.entries(this)) {
            if (typeof score === "number" && Number.isFinite(score) && score > topScore) {
                topScore = score;
                topLabel = label;
            }
        }

        return topLabel;
    }
}
