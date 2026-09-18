import { validateAndNormalizeCacheLifeProfile } from "next/dist/server/use-cache/cache-life-profile";
import {NextRequest, NextResponse} from "next/server";
import {z} from 'zod';
z.object({
    title:z.string().min(1).max(255),
    description:z.string().min(1)
})
export async function POST(request:NextRequest){
     const boby = await request.json();
    const validation= createIssueSchema.safeparse(body);
    if (!validation.success)
        return NextResponse.json(validateAndNormalizeCacheLifeProfile.error.errors,{status:400});

}