use anchor_lang::prelude::*;
pub mod constant;
pub mod states;
use crate::{ constant::*, states::* };

declare_id!("J5yzCZrNZJR6K5FUwwZ2SzjTvg8DzomcYqcaZJm27Y6v");

#[program]
pub mod dimori {
    use super::*;

pub fn initialize_user(ctx: Context<InitializeUser>) -> Result < () > {
    // Initialize user profile with default data

    let user_profile       = &mut ctx.accounts.user_profile;
    user_profile.authority = ctx.accounts.authority.key();
    user_profile.last      = 0;
    user_profile.count     = 0;

    Ok(())
    }

pub fn add_home(
        ctx       : Context<Add>,
        address   : String,
        longtitude: String,
        latitude  : String,
        location  : String,
        image_path: String,
        theme     : String,
        price     : String
    ) -> Result < () > {
        let user_account = &mut ctx.accounts.user_account;
        let user_profile   = &mut ctx.accounts.user_profile;

        // Fill contents with argument
        user_account.authority  = ctx.accounts.authority.key();
        user_account.idx        = user_profile.last;
        user_account.address    = address;
        user_account.longtitude = longtitude;
        user_account.latitude   = latitude;
        user_account.location   = location;
        user_account.image_path = image_path;
        user_account.theme      = theme;
        user_account.price      = price;
        user_account.isReserved = false;

        // Increase airbnb idx for PDA
        user_profile.last = user_profile.last.checked_add(1).unwrap();

        // Increase total airbnb count
        user_profile.count = user_profile.count.checked_add(1).unwrap();

        Ok(())
    }

pub fn update_home(
        ctx       : Context<Update>,
        index: u8,
        address   : String,
        longtitude: String,
        latitude  : String,
        location  : String,
        image_path: String,
        theme     : String,
        price     : String
    ) -> Result < () > {
    let user_account = &mut ctx.accounts.user_account;

        // Mark todo
        user_account.address    = address;
        user_account.longtitude = longtitude;
        user_account.latitude   = latitude;
        user_account.location   = location;
        user_account.image_path = image_path;
        user_account.price      = price;
        user_account.theme      = theme;
        user_account.price      = price;
        Ok(())
    }

pub fn remove_home(ctx: Context<Remove>, _index: u8) -> Result < () > {
    // Decreate total airbnb count
        let user_profile          = &mut ctx.accounts.user_profile;
        user_profile.count        = user_profile.count.checked_sub(1).unwrap();

        // No need to decrease last airbnb idx

        // Todo PDA already closed in context

        Ok(())
    }

// Need a function that reserves an Airbnb
pub fn book_home(
        ctx        : Context<Book>,
        idx        : u8,
        date       : String,
        address    : String,
        longtitude : String,
        latitude   : String,
        location   : String,
        image_path : String,
        theme      : String,
        price      : String
    ) -> Result < () > {
        let booking_account = &mut ctx.accounts.booking_account;

        // // Fill contents with argument
        booking_account.authority  = ctx.accounts.authority.key();
        booking_account.idx        = idx;
        booking_account.date       = date;
        booking_account.address    = address;
        booking_account.longtitude = longtitude;
        booking_account.latitude   = latitude;
        booking_account.location   = location;
        booking_account.image_path = image_path;
        booking_account.theme      = theme;
        booking_account.price      = price;
        booking_account.isReserved = true;

        Ok(())
    }

pub fn cancel_booking(ctx: Context<CancelBook>, _booking_idx: u8) -> Result < () > {
        // Decreate total airbnb count
        let user_profile = &mut ctx.accounts.user_profile;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<UserProfile>()
    )]
    pub user_profile: Box < Account < 'info, UserProfile>>,

    pub system_program: Program < 'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct Add<'info> {
    #[account(
        mut,
        seeds   = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box < Account < 'info, UserProfile>>,

    #[account(
        init,
        seeds = [INFO_TAG, authority.key().as_ref(), &[user_profile.last]],
        bump,
        payer = authority,
        space = 2865 + 8
    )]
    pub user_account: Box < Account < 'info, UserAccount>>,

    #[account(mut)]
    pub authority: Signer < 'info>,

    pub system_program: Program < 'info, System>,
}

#[derive(Accounts)]
#[instruction(index: u8)]
pub struct Update<'info> {
    #[account(
        mut,
        seeds   = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box < Account < 'info, UserProfile>>,

    #[account(
        mut,
        seeds   = [INFO_TAG, authority.key().as_ref(), &[index].as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_account: Box < Account < 'info, UserAccount>>,

    #[account(mut)]
    pub authority: Signer < 'info>,

    pub system_program: Program < 'info, System>,
}

#[derive(Accounts)]
#[instruction(index: u8)]
pub struct Remove<'info> {
    #[account(
        mut,
        seeds   = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box < Account < 'info, UserProfile>>,

    #[account(
        mut,
        close   = authority,
        seeds   = [INFO_TAG, authority.key().as_ref(), &[index].as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_account: Box < Account < 'info, UserAccount>>,

    #[account(mut)]
    pub authority: Signer < 'info>,

    pub system_program: Program < 'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct Book<'info> {
    #[account(
        mut,
        seeds   = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box < Account < 'info, UserProfile>>,

    #[account(
        init,
        seeds = [BOOK_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 3125 + 8
    )]
    pub booking_account: Box < Account < 'info, BookingAccount>>,

    #[account(mut)]
    pub authority: Signer < 'info>,

    pub system_program: Program < 'info, System>,
}

#[derive(Accounts)]
pub struct CancelBook<'info> {
    #[account(
        mut,
        seeds   = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box < Account < 'info, UserProfile>>,

    #[account(
        mut,
        close   = authority,
        seeds   = [BOOK_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub booking_account: Box < Account < 'info, BookingAccount>>,

    #[account(mut)]
    pub authority: Signer < 'info>,

    pub system_program: Program < 'info, System>,
}