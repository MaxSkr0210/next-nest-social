import { Injectable } from "@nestjs/common";
import { PrismaClient } from "../../prisma/generated/prisma";

@Injectable()
export class PrismaService extends PrismaClient {}
