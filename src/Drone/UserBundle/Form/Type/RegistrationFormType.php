<?php

namespace Drone\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class RegistrationFormType extends AbstractType
{
	public function buildForm(FormBuilderInterface $builder, array $options) {
		$builder->add('email', 'email', array('label' => 'form.email', 'translation_domain' => 'FOSUserBundle'))
			->add('username', null, array('label' => 'form.username', 'translation_domain' => 'FOSUserBundle'))
			->add('address')
			->add('city')
			->add('zipcode')
			->add('city')
			->add('country', 'country')
			->add('imageFile', 'file', array(
				'required' => false,
				))
			/*->add('imageFile', 'vich_image', array(
					'required'      => false,
					'allow_delete'  => true,
					'download_link' => false,
				))*/
			->add('plainPassword', 'repeated', array(
				'type' => 'password',
				'options' => array('translation_domain' => 'FOSUserBundle'),
				'first_options' => array('label' => 'form.password'),
				'second_options' => array('label' => 'form.password_confirmation'),
				'invalid_message' => 'fos_user.password.mismatch',
			));
	}

	public function getParent() {
		return 'fos_user_registration';
	}

	public function getName() {
		return 'drone_user_registration';
	}
}

