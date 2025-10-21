import React from "react";

import "./ClientTrailCursorCanvas.scss";

type Props = {};

export const ClientTrailCursorCanvas = (props: Props) => {
	return <canvas hidden id="cursor-trail-canvas"></canvas>;
};

export default ClientTrailCursorCanvas;
