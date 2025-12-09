interface CookieOptions {
  days?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  const {
    days = 7,
    path = '/',
    domain,
    secure = true,
    sameSite = 'lax'
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  cookieString += `; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  cookieString += `; SameSite=${sameSite}`;

  document.cookie = cookieString;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
};


export const removeCookie = (name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void => {
  const { path = '/', domain } = options;
  
  let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  
  document.cookie = cookieString;
};


export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    const [name, value] = cookie.split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
};

export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};


export const cookieStorage = {
  setItem: (key: string, value: string, options?: CookieOptions) => {
    setCookie(key, value, options);
  },

  getItem: (key: string): string | null => {
    return getCookie(key);
  },

  removeItem: (key: string, options?: Pick<CookieOptions, 'path' | 'domain'>) => {
    removeCookie(key, options);
  },

  clear: () => {
    const cookies = getAllCookies();
    Object.keys(cookies).forEach(key => removeCookie(key));
  },

  has: (key: string): boolean => {
    return hasCookie(key);
  },
};
