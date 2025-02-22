import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential
} from '@angular/fire/auth';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(Auth);

  signIn(user: User): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      user.email,
      user.password
    );
  }

  signUp(user: User): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      user.email,
      user.password
    );
  }

  async updateUser(displayName: string) {
    const user = await this.auth.currentUser;
    if (user) {
      await updateProfile(user, {displayName: displayName});
    }
  }
}
