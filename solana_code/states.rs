use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority : Pubkey,
    pub last      : u8,
    pub count     : u8,
}

#[account]
#[derive(Default)]
pub struct UserAccount {
    pub authority  : Pubkey,
    pub idx        : u8,
    pub address    : String,
    pub longtitude : String,
    pub latitude   : String,
    pub location   : String,
    pub image_path : String,
    pub theme      : String,
    pub price      : String,
    pub isReserved : bool
}

#[account]
#[derive(Default)]
pub struct BookingAccount {
    pub authority  : Pubkey,
    pub idx        : u8,
    pub date       : String,
    pub address    : String,
    pub longtitude : String,
    pub latitude   : String,
    pub location   : String,
    pub image_path : String,
    pub theme      : String,
    pub price      : String,
    pub isReserved : bool
}