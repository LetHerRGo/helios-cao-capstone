import axios from 'axios';

const apiKey = import.meta.env.VITE_X_APIKEY;
const secret = import.meta.env.VITE_SECRET;
const trackingUrl = import.meta.env.VITE_TRACKING_URL;



async function getToken() {
    const endpointUrl = 'https://cnr-prod-prd.apigee.net/v1/oauth/jwt-token/accesstokenJWT?grant_type=client_credentials';
    
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-apikey': apiKey
    };

    try {
        const response = await axios.post(endpointUrl, null, {
            headers: headers,
            auth: {
                username: apiKey,
                password: secret
            }
        });

        if (response.status === 200) {
            const token = response.data.access_token;

            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
        } else {
            console.error(`Failed to fetch data. Status code: ${response.status}`);
            return response.status;
        }
    } catch (error) {
        console.error('Error fetching token:', error);
        return null;
    }
}

// getToken().then(headers => console.log(headers));


export async function tracking(ctnrNum) {
    const headers = await getToken();
    const trackingParam = {
        equipmentIds: ctnrNum
    }
    try {
    const response = await axios.get(trackingUrl, { headers, params: trackingParam } );
    console.log(response.data)
    return response.data;
    
    } catch(error) {
        console.error('Error fetching tracking data:', error);
        return null;
    }
}

