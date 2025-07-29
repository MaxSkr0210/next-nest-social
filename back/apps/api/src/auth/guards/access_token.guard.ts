import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AccessTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = request.headers.authorization.split(" ")[1];

        if (!token) {
            throw new UnauthorizedException();
        }

        return true;
    }
}
