import { BaseResponse } from "../base.response.model";

export interface PostLoginResponse extends BaseResponse {
    idToken: string;
    tokenExpiresIn: number;
}