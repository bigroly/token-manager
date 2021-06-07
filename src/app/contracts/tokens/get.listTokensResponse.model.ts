import { AppToken } from "src/app/models/token/appToken.model";
import { BaseResponse } from "../base.response.model";

export interface GetListTokensResponse extends BaseResponse {
    tokens: AppToken[];
}