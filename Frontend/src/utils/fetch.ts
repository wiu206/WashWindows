const api_base = import.meta.env.VITE_API_URL;
/**
 * 異步呼叫api, 只可用響應體為 json 的 api
 * @param api 要呼叫的api
 * @returns json 結果
 */
export async function asyncGet(api: string, { headers = {} }: {headers?: HeadersInit}):Promise<any>{
    try {
        const res: Response = await fetch(api, {
            headers: {
                'Access-Control-Allow-Origin': api_base,
                'Content-Type': 'application/json',
                ...headers,
            },
        })
        try {
            return await res.json()
        } catch (error) {
            return error
        }
    } catch (error) {
        return error
    }
}

export async function asyncPost(api: string, { body, headers = {} }: { body: any, headers?: HeadersInit }): Promise<Response> {
    try {
        const res: Response = await fetch(api, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': api_base,
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body instanceof FormData ? body : JSON.stringify(body),
            mode: 'cors',
        });
        
        return res;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}

export async function asyncPut(api: string, { body, headers = {} }: { body?: any, headers?: HeadersInit }): Promise<Response> {
    try {
        const res: Response = await fetch(api, {
            method: 'PUT',
            headers: {
                'Access-Control-Allow-Origin': api_base,
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body instanceof FormData ? body : JSON.stringify(body),
            mode: 'cors',
        });
        
        return res;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}

export async function asyncDelete(api: string, { body, headers = {} }: { body?: any, headers?: HeadersInit }): Promise<Response> {
    try {
        const res: Response = await fetch(api, {
            method: 'DELETE',
            headers: {
                'Access-Control-Allow-Origin': api_base,
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body instanceof FormData ? body : JSON.stringify(body),
            mode: 'cors',
        });
        
        return res;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}