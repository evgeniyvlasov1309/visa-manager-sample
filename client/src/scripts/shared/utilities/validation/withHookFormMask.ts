/* eslint-disable @typescript-eslint/space-before-blocks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Inputmask from "inputmask";
import flowright from "lodash.flowright";
import type { UseFormRegisterReturn } from "react-hook-form";

const withHookFormMask = (
    registerReturn: UseFormRegisterReturn,
    mask: Inputmask.Options["mask"],
    options?: Inputmask.Options
) => {
    let newRef;

    if (registerReturn) {
        const { ref } = registerReturn;

        const maskInput = Inputmask({
            mask,
            ...options,
        });

        newRef = flowright(ref, (_ref) => {
            if (_ref) maskInput.mask(_ref);
            return _ref;
        });
    }

    return {
        ...registerReturn,
        ref: newRef,
    };
};

export default withHookFormMask;
