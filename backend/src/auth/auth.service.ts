import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(phone: string) {
    // 查找或创建用户（模拟手机号登录）
    let user = await this.usersRepository.findOne({ 
      where: { phone } 
    });

    if (!user) {
      // 新用户自动注册
      user = this.usersRepository.create({
        phone,
        name: `用户${phone.slice(-4)}`,
      });
      user = await this.usersRepository.save(user);
    }

    // 生成JWT token
    const payload = { 
      sub: user.id, 
      phone: user.phone,
      name: user.name 
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
      },
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({ 
      where: { id: userId } 
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
    };
  }
}
