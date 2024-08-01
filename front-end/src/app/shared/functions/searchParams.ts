import { HttpParams } from "@angular/common/http";

const searchParams = (params?) => {
  let searchParams = new HttpParams();
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const param = params[key];

      if(param != null) searchParams = searchParams.append(key, param);
    }
  }
  return searchParams;
}

export {searchParams}