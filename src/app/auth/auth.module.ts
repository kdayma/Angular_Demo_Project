import { NgModule } from "@angular/core";
import { AuthenticationComponent } from "./auth.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Route, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

const authRoutes:Route[] = [{path:'',component:AuthenticationComponent}];

@NgModule({
    declarations:[
        AuthenticationComponent
    ],
    imports:[
        FormsModule,
        CommonModule,
        RouterModule.forChild(authRoutes),
        SharedModule
    ]
})
export class AuthModule{}