package com.typingpractice.typing_practice_be.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckNicknameRequest {
  @NotNull
  @NotBlank
  @Pattern(regexp = "\\X{2,10}", message = "닉네임은 2-10자여야 합니다.")
  private String nickname;

  public static CheckNicknameRequest create(String nickname) {
    CheckNicknameRequest request = new CheckNicknameRequest();
    request.nickname = nickname;

    return request;
  }
}
