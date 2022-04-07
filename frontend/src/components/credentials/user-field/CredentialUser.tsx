import React from "react";
import { Box, Tooltip } from "@mui/material";
import { sendToast, Toast } from "../../../store/slices/ToastSlice";
import { useAppDispatch } from "../../../store/store";

const onDoubleClick = function (this: any) {
    const { user, dispatch } = this;
    navigator.clipboard
        .writeText(user)
        .then(
            () =>
                ({
                    message: "Copied to clipboard!",
                    severity: "success",
                } as Toast)
        )
        .catch(
            () =>
                ({
                    message: "Unable to copy.",
                    severity: "error",
                } as Toast)
        )
        .then((toast) => dispatch(sendToast(toast)));
};

export default function CredentialUser(props: { user: string }) {
    const dispatch = useAppDispatch();
    return (
        <Tooltip arrow title={props.user ? "Double click to copy" : ""}>
            <Box
                onDoubleClick={onDoubleClick.bind({
                    dispatch,
                    user: props.user,
                })}
                sx={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                }}
            >
                {props.user}
            </Box>
        </Tooltip>
    );
}
