import type { EmailCodeDTO, LoginDTO, RegisterDTO } from './types';
import { get, post } from '@/utils/request';

export const login = (data: LoginDTO) => post('/auth/login', data).json();

// 邮箱验证码
export const emailCode = (data: EmailCodeDTO) => post('/resource/email/code', data).json();

// 注册账号
export const register = (data: RegisterDTO) => post('/auth/register', data).json();

export const getInfoApi = () => get('/user/getInfo');
