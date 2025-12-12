import {
    IsEnum,
    IsOptional,
    IsUUID,
    ValidateNested,
    IsString,
    IsBoolean,
    IsObject,
    IsUrl,
    IsNotEmpty,
} from "class-validator"
import { Type } from "class-transformer"
import "reflect-metadata"

import { IsQueryRequiredIfNested } from "@/decorators/scrapers/is-query-required-if-nested.decorator"
import { ParsingModelFieldType } from "@/enums/scrapers/parsing-model-field-type"
import { EmptyToUndefined } from "../../decorators/empty-to-undefined"

export class CreateParsingModelDto {
    @IsEnum(ParsingModelFieldType)
    type: ParsingModelFieldType

    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => CreateParsingModelFieldDto)
    model: Record<string, CreateParsingModelFieldDto>
}

export class CreateParsingModelFieldDto {
    @IsOptional()
    @IsString()
    @EmptyToUndefined()
    @IsQueryRequiredIfNested("nested", {
        message: "`query` is required when `nested` is present.",
    })
    query?: string

    @IsOptional()
    @IsString()
    @EmptyToUndefined()
    extractor?: string

    @IsOptional()
    @IsBoolean()
    multiple?: boolean

    @IsOptional()
    @EmptyToUndefined()
    default?: any

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateParsingModelDto)
    nested?: CreateParsingModelDto
}

export class CreateRequestConfigDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @EmptyToUndefined()
    method?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @EmptyToUndefined()
    userAgent?: string
}
export class CreateScraperDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @EmptyToUndefined()
    description?: string

    @IsOptional()
    @IsUrl()
    @EmptyToUndefined()
    defaultUrl?: string

    @IsUUID()
    clientId: string

    @ValidateNested()
    @Type(() => CreateParsingModelDto)
    parsingModel: CreateParsingModelDto

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateRequestConfigDto)
    requestConfig?: CreateRequestConfigDto
}